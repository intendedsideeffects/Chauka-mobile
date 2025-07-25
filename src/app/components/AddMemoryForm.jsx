import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

function AddMemoryForm({ onAdd }) {
  const [type, setType] = useState('story');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [year, setYear] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [memories, setMemories] = useState([]);

  // Fetch memories for the list at the bottom
  useEffect(() => {
    async function fetchMemories() {
      const { data, error } = await supabase.from('memories').select('*');
      if (!error) setMemories(data);
    }
    fetchMemories();
  }, []);

  // Add delete handler for memories
  const handleDeleteMemory = async (id) => {
    await supabase.from('memories').delete().eq('id', id);
    setMemories(memories => memories.filter(m => m.id !== id));
    if (onAdd) onAdd(null); // Notify parent to refresh scatterplot
  };

  async function uploadFile(file, type) {
    const fileExt = file.name.split('.').pop();
    const filePath = `${type}/${Date.now()}-${file.name}`;
    setUploading(true);
    const { data, error } = await supabase.storage
      .from('memoriesmedia')
      .upload(filePath, file);
    setUploading(false);
    if (error) throw error;
    const { data: urlData } = supabase.storage
      .from('memoriesmedia')
      .getPublicUrl(filePath);
    return urlData.publicUrl;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    let memoryContent = content;
    try {
      if ((type === 'image' || type === 'sound') && file) {
        memoryContent = await uploadFile(file, type);
      }
      const { data, error } = await supabase.from('memories').insert([
        { type, content: memoryContent, author, year: year ? Number(year) : null }
      ]).select().single();
      setLoading(false);
      if (error) {
        setError(error.message);
      } else {
        setContent('');
        setAuthor('');
        setType('story');
        setYear('');
        setFile(null);
        if (onAdd) onAdd(data);
      }
    } catch (err) {
      setLoading(false);
      setError(err.message || 'File upload failed');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="p-4 border rounded mb-4 bg-white max-w-md mx-auto">
        <div className="mb-2">
          <label className="block font-semibold mb-1">Type:</label>
          <select value={type} onChange={e => { setType(e.target.value); setContent(''); setFile(null); }} className="border rounded p-1 w-full">
            <option value="story">Story</option>
            <option value="sound">Sound</option>
            <option value="image">Image</option>
            <option value="quote">Quote</option>
          </select>
        </div>
        <div className="mb-2">
          <label className="block font-semibold mb-1">
            {type === 'image' ? 'Image file:' : type === 'sound' ? 'Sound file:' : 'Content:'}
          </label>
          {(type === 'image' || type === 'sound') ? (
            <input
              type="file"
              accept={type === 'image' ? 'image/*' : 'audio/*'}
              onChange={e => setFile(e.target.files[0])}
              className="border rounded p-1 w-full"
              required
            />
          ) : (
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              required
              rows={type === 'story' || type === 'quote' ? 3 : 1}
              className="border rounded p-1 w-full"
            />
          )}
        </div>
        <div className="mb-2">
          <label className="block font-semibold mb-1">Author:</label>
          <input
            type="text"
            value={author}
            onChange={e => setAuthor(e.target.value)}
            className="border rounded p-1 w-full"
          />
        </div>
        <div className="mb-2">
          <label className="block font-semibold mb-1">Year (optional):</label>
          <select
            value={year}
            onChange={e => setYear(e.target.value)}
            className="border rounded p-1 w-full"
          >
            <option value="">-- Select year --</option>
            {Array.from({ length: 2025 - 1900 + 1 }, (_, i) => 2025 - i).map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        {uploading && <div className="text-blue-600 mb-2">Uploading file...</div>}
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading || uploading}>
          {loading ? 'Adding...' : 'Add Memory'}
        </button>
      </form>

      <h2>Memories</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32 }}>
        {memories.length === 0 ? (
          <div>No memories yet.</div>
        ) : (
          memories.map(memory => (
            <div
              key={memory.id}
              style={{
                position: 'relative',
                width: 220,
                minHeight: 120,
                border: '1px solid #eee',
                borderRadius: 8,
                background: '#fff',
                boxShadow: '0 2px 8px #0001',
                marginBottom: 24,
                padding: 12,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'box-shadow 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px #0002'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 8px #0001'}
            >
              {/* Delete X button */}
              <button
                onClick={() => handleDeleteMemory(memory.id)}
                style={{
                  position: 'absolute',
                  top: 6,
                  right: 8,
                  background: 'transparent',
                  border: 'none',
                  color: '#e74c3c',
                  fontSize: 20,
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  opacity: 0.5,
                  transition: 'opacity 0.2s',
                  zIndex: 2,
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = 1}
                onMouseLeave={e => e.currentTarget.style.opacity = 0.5}
                aria-label="Delete memory"
                title="Delete"
              >
                ×
              </button>
              {/* Memory content */}
              {memory.type === 'image' ? (
                <img src={memory.content} alt="memory" style={{ maxWidth: 180, borderRadius: 6, marginBottom: 8 }} />
              ) : memory.type === 'sound' ? (
                <audio src={memory.content} controls style={{ width: '100%', marginBottom: 8 }} />
              ) : (
                <div style={{ marginBottom: 8 }}>{memory.content}</div>
              )}
              <div style={{ fontSize: 13, color: '#555', marginTop: 4 }}>
                by {memory.author}{memory.year ? ` (${memory.year})` : ''}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AddMemoryForm; 