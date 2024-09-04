-- Create the Users table
CREATE TABLE Users (
    UserID INT PRIMARY KEY AUTO_INCREMENT,
    Username VARCHAR(50) NOT NULL UNIQUE,
    Email VARCHAR(100) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the Events table
CREATE TABLE Events (
    EventID INT PRIMARY KEY AUTO_INCREMENT,
    UserID INT,
    Title VARCHAR(100) NOT NULL,
    Description TEXT,
    EventDate DATE NOT NULL,
    StartTime TIME,
    EndTime TIME,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

-- Create the RecurringEvents table
CREATE TABLE RecurringEvents (
    RecurringEventID INT PRIMARY KEY AUTO_INCREMENT,
    EventID INT,
    RecurrenceType ENUM('daily', 'weekly', 'monthly', 'yearly') NOT NULL,
    RecurrenceInterval INT NOT NULL,
    RecurrenceEndDate DATE,
    FOREIGN KEY (EventID) REFERENCES Events(EventID)
);

-- Create the EventReminders table
CREATE TABLE EventReminders (
    ReminderID INT PRIMARY KEY AUTO_INCREMENT,
    EventID INT,
    ReminderTime DATETIME NOT NULL,
    ReminderType ENUM('email', 'push', 'sms') NOT NULL,
    FOREIGN KEY (EventID) REFERENCES Events(EventID)
);

-- Create the EventCategories table
CREATE TABLE EventCategories (
    CategoryID INT PRIMARY KEY AUTO_INCREMENT,
    CategoryName VARCHAR(50) NOT NULL UNIQUE,
    Color VARCHAR(7) NOT NULL
);

-- Create the EventCategoryMapping table
CREATE TABLE EventCategoryMapping (
    EventID INT,
    CategoryID INT,
    PRIMARY KEY (EventID, CategoryID),
    FOREIGN KEY (EventID) REFERENCES Events(EventID),
    FOREIGN KEY (CategoryID) REFERENCES EventCategories(CategoryID)
);

-- Insert some sample event categories
INSERT INTO EventCategories (CategoryName, Color) VALUES
('Work', '#FF0000'),
('Personal', '#00FF00'),
('Holiday', '#0000FF'),
('Birthday', '#FFA500'),
('Meeting', '#800080');

-- Create an index on the EventDate column for faster querying
CREATE INDEX idx_event_date ON Events(EventDate);

-- Create a view for upcoming events
CREATE VIEW UpcomingEvents AS
SELECT e.EventID, e.UserID, e.Title, e.Description, e.EventDate, e.StartTime, e.EndTime, u.Username
FROM Events e
JOIN Users u ON e.UserID = u.UserID
WHERE e.EventDate >= CURDATE()
ORDER BY e.EventDate, e.StartTime;

-- Create a stored procedure to get events for a specific date range
DELIMITER //
CREATE PROCEDURE GetEventsByDateRange(
    IN p_UserID INT,
    IN p_StartDate DATE,
    IN p_EndDate DATE
)
BEGIN
    SELECT e.EventID, e.Title, e.Description, e.EventDate, e.StartTime, e.EndTime,
           GROUP_CONCAT(ec.CategoryName) AS Categories
    FROM Events e
    LEFT JOIN EventCategoryMapping ecm ON e.EventID = ecm.EventID
    LEFT JOIN EventCategories ec ON ecm.CategoryID = ec.CategoryID
    WHERE e.UserID = p_UserID
      AND e.EventDate BETWEEN p_StartDate AND p_EndDate
    GROUP BY e.EventID
    ORDER BY e.EventDate, e.StartTime;
END //
DELIMITER ;

-- Create a trigger to automatically update the UpdatedAt timestamp
DELIMITER //
CREATE TRIGGER before_event_update
BEFORE UPDATE ON Events
FOR EACH ROW
BEGIN
    SET NEW.UpdatedAt = CURRENT_TIMESTAMP;
END //
DELIMITER ;