import csv

# Read the original file
with open('public/compiled_sea_level_rise_data.csv', 'r') as file:
    lines = file.readlines()

# Clean lines and remove duplicates
seen = set()
clean_lines = []

for line in lines:
    line = line.strip()
    if line and line not in seen:
        clean_lines.append(line)
        seen.add(line)

# Write cleaned file
with open('public/compiled_sea_level_rise_data_clean.csv', 'w', newline='') as file:
    for line in clean_lines:
        file.write(line + '\n')

print(f'Cleaned {len(lines)} lines to {len(clean_lines)} unique lines')

# Verify the data with proper European decimal handling
data = []
for line in clean_lines:
    if ';' in line:
        parts = line.split(';')
        if len(parts) >= 2:
            try:
                # Handle European decimal format (comma as decimal separator)
                year_str = parts[0].replace(',', '.')
                value_str = parts[1].replace(',', '.')
                
                year = float(year_str)
                value = float(value_str)
                data.append((year, value))
            except ValueError as e:
                print(f"Error parsing line: {line} - {e}")
                continue

print(f'Parsed {len(data)} valid data points')
if data:
    print(f'Year range: {data[0][0]} to {data[-1][0]}')
    print(f'Value range: {min(d[1] for d in data)} to {max(d[1] for d in data)}')
    
    # Count data by period
    historical = [d for d in data if d[0] < 1993]
    satellite = [d for d in data if 1993 <= d[0] < 2025]
    projection = [d for d in data if d[0] >= 2025]
    
    print(f'Historical data: {len(historical)} points')
    print(f'Satellite data: {len(satellite)} points')
    print(f'Projection data: {len(projection)} points') 