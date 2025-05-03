INSERT INTO members (
    member_id, first_name, last_name, contact_number, address, join_date, expiration_date, status_id
)
VALUES
(UUID(), 'Liam', 'Santos', '09171234501', '123 Mango St.', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 28 DAY), 1),
(UUID(), 'Maya', 'Reyes', '09171234502', '456 Banana Ave.', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 84 DAY), 1),
(UUID(), 'Lucas', 'Garcia', '09171234503', '789 Apple Blvd.', CURDATE(), DATE_ADD(CURDATE(), INTERVAL -2 DAY), 2),
(UUID(), 'Isla', 'Cruz', '09171234504', '101 Orange Rd.', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 168 DAY), 1),
(UUID(), 'Noah', 'Torres', '09171234505', '202 Pine St.', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 336 DAY), 1),
(UUID(), 'Aria', 'Rivera', '09171234506', '303 Coconut Ln.', CURDATE(), DATE_ADD(CURDATE(), INTERVAL -7 DAY), 2),
(UUID(), 'Ethan', 'Flores', '09171234507', '404 Papaya St.', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 84 DAY), 1),
(UUID(), 'Luna', 'Ramos', '09171234508', '505 Melon Ave.', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 DAY), 1),
(UUID(), 'Leo', 'Gomez', '09171234509', '606 Avocado Blvd.', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 0 DAY), 2),
(UUID(), 'Sofia', 'Delos Santos', '09171234510', '707 Lemon Rd.', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 168 DAY), 1),
(UUID(), 'Mateo', 'Mendoza', '09171234511', '808 Guava St.', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 28 DAY), 1),
(UUID(), 'Chloe', 'Aguilar', '09171234512', '909 Peach Ave.', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 3 DAY), 1),
(UUID(), 'Sebastian', 'Castro', '09171234513', '1010 Lychee Blvd.', CURDATE(), DATE_ADD(CURDATE(), INTERVAL -1 DAY), 2),
(UUID(), 'Amara', 'Morales', '09171234514', '1111 Dalandan Rd.', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 336 DAY), 1),
(UUID(), 'Daniel', 'Silva', '09171234515', '1212 Tamarind St.', CURDATE(), DATE_ADD(CURDATE(), INTERVAL -10 DAY), 3),
(UUID(), 'Zoe', 'Ortiz', '09171234516', '1313 Jackfruit Ln.', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 84 DAY), 1),
(UUID(), 'Adrian', 'Roxas', '09171234517', '1414 Watermelon Ave.', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 28 DAY), 1),
(UUID(), 'Lily', 'Domingo', '09171234518', '1515 Durian Blvd.', CURDATE(), DATE_ADD(CURDATE(), INTERVAL -5 DAY), 2),
(UUID(), 'Gabriel', 'Dela Cruz', '09171234519', '1616 Rambutan St.', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 DAY), 1),
(UUID(), 'Clara', 'Navarro', '09171234520', '1717 Starfruit Rd.', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 0 DAY), 3);
