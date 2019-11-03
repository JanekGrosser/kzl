CREATE VIEW `division_shifts_view` AS
    SELECT 
        `ms`.`user_id` AS `user_id`,
        `u`.`role_id` AS `role_id`,
        `u`.`user_subdivisions` AS `user_subdivisions`,
        `ms`.`month_id` AS `month_id`,
        `ms`.`day_number` AS `day_number`,
        `ms`.`shift_id` AS `shift_id`,
        `ms`.`status_id` AS `status_id`
    FROM
        (`man_shifts` `ms`
        JOIN `users_view` `u` ON ((`u`.`user_id` = `ms`.`user_id`)));