CREATE VIEW `users_approval_view` AS
    SELECT 
        `u`.`user_id` AS `user_id`,
        `u`.`username_csr` AS `username_csr`,
        `u`.`first_name` AS `first_name`,
        `u`.`last_name` AS `last_name`,
        `u`.`phone_num` AS `phone_num`,
        `u`.`active` AS `active`,
        `u`.`role_id` AS `role_id`,
        `u`.`role` AS `role`,
        `u`.`last_pass_reset` AS `last_pass_reset`,
        `u`.`user_subdivisions` AS `user_subdivisions`,
        `a`.`month_id` AS `month_id`,
        `a`.`sent_at` AS `sent_at`
    FROM
        (`users_view` `u`
        LEFT JOIN `approval_sent_at` `a` ON ((`u`.`user_id` = `a`.`user_id`)));
