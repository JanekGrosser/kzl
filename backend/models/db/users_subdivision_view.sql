CREATE VIEW `user_subdivisions_view` AS
    SELECT 
        `u`.`user_id` AS `user_id`,
        `u`.`username_csr` AS `username_csr`,
        `u`.`phone_num` AS `phone_num`,
        `u`.`active` AS `active`,
        `u`.`role_id` AS `role_id`,
        `s`.`subdivision_id` AS `subdivision_id`,
        `s`.`subdivision_name` AS `subdivision_name`
    FROM
        (((`users` `u`
        JOIN `users_subdivisions` `us` ON ((`us`.`users_user_id` = `u`.`user_id`)))
        JOIN `subdivisions` `s` ON ((`s`.`subdivision_id` = `us`.`subdivisions_subdivision_id`)))
        JOIN `roles` `r` ON ((`u`.`role_id` = `r`.`role_id`)));