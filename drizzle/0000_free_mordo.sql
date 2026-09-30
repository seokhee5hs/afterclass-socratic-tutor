CREATE TABLE `limits` (
	`key` text PRIMARY KEY NOT NULL,
	`count` integer NOT NULL,
	`expires` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `questions` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`student_id` text NOT NULL,
	`email` text NOT NULL,
	`topic` text NOT NULL,
	`question` text NOT NULL,
	`transcript` text DEFAULT '[]' NOT NULL,
	`status` text DEFAULT 'new' NOT NULL,
	`answer` text DEFAULT '' NOT NULL,
	`created_at` text NOT NULL,
	`answered_at` text
);
--> statement-breakpoint
CREATE INDEX `idx_questions_created` ON `questions` (`created_at`);--> statement-breakpoint
CREATE TABLE `settings` (
	`id` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL
);
