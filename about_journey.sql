-- Encogix company journey content for MySQL.
-- Run after backend/schema.sql when this content should be available to admin/reporting tools.
CREATE TABLE IF NOT EXISTS about_journey (
  id INT AUTO_INCREMENT PRIMARY KEY,
  journey_year YEAR NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
);

INSERT INTO about_journey (journey_year, title, description, sort_order) VALUES
  (2023, 'Encogix begins its journey', 'Encogix Technology started with a clear goal: help businesses turn practical ideas into reliable websites, software, and digital systems.', 1),
  (2024, 'Building products and trust', 'We expanded our capabilities across web development, ecommerce, mobile apps, CRM, and digital marketing while growing long-term client partnerships.', 2),
  (2025, 'Greater Noida branch opened', 'To work more closely with businesses in the Delhi NCR region, Encogix opened a new branch at Gaur City Center, Greater Noida, Uttar Pradesh.', 3),
  (2026, 'Growing as a digital engineering partner', 'Today, our team supports businesses with custom software, AI automation, cloud delivery, SEO, and dedicated development talent across India.', 4)
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  description = VALUES(description),
  sort_order = VALUES(sort_order);