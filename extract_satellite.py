import csv

# Read the original satellite data
with open('public/global_mean_sea_level_1993-2024.csv', 'r') as file:
    reader = csv.reader(file)
    next(reader)  # Skip header
    
    # Extract year and GMSLWithGIA (column 8)
    satellite_data = []
    for row in reader:
        if len(row) >= 9:
            try:
                year = float(row[2])  # YearPlusFraction
                value = float(row[8])  # GMSLWithGIA
                satellite_data.append((year, value))
            except ValueError:
                continue

# Write to new file with semicolon separator and comma decimals
with open('public/complete_satellite_data.csv', 'w', newline='') as file:
    for year, value in satellite_data:
        # Convert year to format like 1993,011526
        year_str = f'{year:.6f}'.replace('.', ',')
        # Convert value to format like -37,9
        value_str = f'{value:.1f}'.replace('.', ',')
        file.write(f'{year_str};{value_str}\n')

print(f'Extracted {len(satellite_data)} data points from 1993 to 2024')
print(f'First: {satellite_data[0]}')
print(f'Last: {satellite_data[-1]}') 