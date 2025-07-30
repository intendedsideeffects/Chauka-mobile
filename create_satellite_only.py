# Create satellite data only (1993-2024) in clean format
import csv

# Read the original satellite data file
with open('public/global_mean_sea_level_1993-2024.csv', 'r') as file:
    reader = csv.reader(file)
    next(reader)  # Skip header
    
    satellite_data = []
    for row in reader:
        if len(row) >= 9:
            try:
                year = float(row[2])  # YearPlusFraction
                value = float(row[8])  # GMSLWithGIA
                satellite_data.append((year, value))
            except ValueError:
                continue

# Sort by year
satellite_data.sort(key=lambda x: x[0])

# Write to new file with semicolon separator and comma decimals
with open('public/satellite_data_1993_2024.csv', 'w', newline='', encoding='utf-8') as file:
    for year, value in satellite_data:
        # Convert year to format like 1993,011526
        year_str = f'{year:.6f}'.replace('.', ',')
        # Convert value to format like -37,9
        value_str = f'{value:.1f}'.replace('.', ',')
        file.write(f'{year_str};{value_str}\n')

print(f'Created satellite data file with {len(satellite_data)} data points')
print(f'Year range: {satellite_data[0][0]:.1f} to {satellite_data[-1][0]:.1f}')
print(f'Value range: {min(d[1] for d in satellite_data):.1f} to {max(d[1] for d in satellite_data):.1f}')

# Show first few and last few entries
print('\nFirst 5 entries:')
for i in range(min(5, len(satellite_data))):
    year, value = satellite_data[i]
    print(f'{year:.6f} -> {value:.1f}')

print('\nLast 5 entries:')
for i in range(max(0, len(satellite_data)-5), len(satellite_data)):
    year, value = satellite_data[i]
    print(f'{year:.6f} -> {value:.1f}') 