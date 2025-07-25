import React, { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';

function Memory({ memory }) {
  switch (memory.type) {
    case 'story':
      return (
        <div className="p-4 border rounded mb-2 bg-white">
          <p>{memory.content}</p>
          {memory.author && <div className="text-sm text-gray-500">by {memory.author}</div>}
        </div>
      );
    case 'quote':
      return (
        <blockquote className="p-4 border-l-4 border-blue-400 italic bg-blue-50 mb-2">
          “{memory.content}”
          {memory.author && <div className="text-sm text-gray-500 mt-2">— {memory.author}</div>}
        </blockquote>
      );
    case 'sound':
      return (
        <div className="p-4 border rounded mb-2 bg-white">
          <audio controls src={memory.content} className="w-full" />
          {memory.author && <div className="text-sm text-gray-500">by {memory.author}</div>}
        </div>
      );
    case 'image':
      return (
        <div className="p-4 border rounded mb-2 bg-white">
          <img src={memory.content} alt="Memory" className="max-w-full h-auto mb-2" />
          {memory.author && <div className="text-sm text-gray-500">by {memory.author}</div>}
        </div>
      );
    default:
      return null;
  }
}

function MemoryList() {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMemories = async () => {
    setLoading(true);
    setError('');
    const { data, error } = await supabase.from('memories').select('*').order('created_at', { ascending: false });
    setLoading(false);
    if (error) setError(error.message);
    else setMemories(data);
  };

  useEffect(() => {
    fetchMemories();
  }, []);

  // For AddMemoryForm to trigger refresh
  MemoryList.refresh = fetchMemories;

  return (
    <div className="max-w-md mx-auto mt-6">
      <h2 className="text-xl font-bold mb-4">Memories</h2>
      {loading && <div>Loading memories...</div>}
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {memories.length === 0 && !loading && <div>No memories yet.</div>}
      {memories.map(memory => (
        <Memory key={memory.id} memory={memory} />
      ))}
    </div>
  );
}

export default MemoryList; 