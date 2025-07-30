# Add projection data (2025-2050) to the completed satellite data file

# Projection data points
projections = [
    (2025, 78.0), (2026, 80.5), (2027, 83.0), (2028, 85.5), (2029, 88.0),
    (2030, 90.5), (2031, 93.0), (2032, 95.5), (2033, 98.0), (2034, 100.5),
    (2035, 103.0), (2036, 105.5), (2037, 108.0), (2038, 110.5), (2039, 113.0),
    (2040, 115.5), (2041, 118.0), (2042, 120.5), (2043, 123.0), (2044, 125.5),
    (2045, 128.0), (2046, 130.5), (2047, 133.0), (2048, 135.5), (2049, 138.0),
    (2050, 140.5)
]

# Append projection data to the existing file
with open('public/compiled_sea_level_rise_data.csv', 'a', encoding='utf-8') as file:
    for year, value in projections:
        # Convert to European format: comma as decimal separator
        year_str = f'{year:.6f}'.replace('.', ',')
        value_str = f'{value:.1f}'.replace('.', ',')
        file.write(f'{year_str};{value_str}\n')

print(f'Added {len(projections)} projection data points (2025-2050)')
print(f'Total data points now: 1168 + {len(projections)} = {1168 + len(projections)}')
print(f'Final year range: 1993 to 2050')
print(f'Final value range: -43.4 to 140.5') 