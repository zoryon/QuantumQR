SELECT
  `u`.`id` AS `id`,
  `u`.`role` AS `role`,
  `u`.`email` AS `email`,
  `u`.`username` AS `username`,
  `u`.`password` AS `password`,
  `u`.`hasAllowedEmails` AS `hasAllowedEmails`,
  `u`.`isEmailConfirmed` AS `isEmailConfirmed`,
  `u`.`createdAt` AS `createdAt`,
  `u`.`updatedAt` AS `updatedAt`
FROM
  (
    `quantumqr`.`users` `u`
    LEFT JOIN `quantumqr`.`banned_users` `bu` ON(
      (
        (`u`.`id` = `bu`.`userId`)
        AND (
          (`bu`.`endsAt` IS NULL)
          OR (`bu`.`endsAt` > NOW())
        )
      )
    )
  )
WHERE
  (
    (`bu`.`userId` IS NULL)
    AND (`u`.`isEmailConfirmed` = TRUE)
  )