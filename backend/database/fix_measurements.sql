-- Fix measurement columns to accept larger values
-- Change from DECIMAL(5,2) to DECIMAL(8,2) to allow values up to 999999.99

USE itailor_db;

ALTER TABLE measurements 
    MODIFY COLUMN chest DECIMAL(8,2),
    MODIFY COLUMN waist DECIMAL(8,2),
    MODIFY COLUMN shoulder DECIMAL(8,2),
    MODIFY COLUMN sleeve_length DECIMAL(8,2),
    MODIFY COLUMN shirt_length DECIMAL(8,2),
    MODIFY COLUMN neck DECIMAL(8,2),
    MODIFY COLUMN pant_length DECIMAL(8,2),
    MODIFY COLUMN pant_waist DECIMAL(8,2),
    MODIFY COLUMN hip DECIMAL(8,2),
    MODIFY COLUMN thigh DECIMAL(8,2),
    MODIFY COLUMN knee DECIMAL(8,2),
    MODIFY COLUMN bottom DECIMAL(8,2);

-- Verify the changes
DESCRIBE measurements;
