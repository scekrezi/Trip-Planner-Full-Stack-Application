package learn.travelplanner.data;

import learn.travelplanner.data.mappers.UserMapper;
import learn.travelplanner.models.User;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

@Repository
public class UserJdbcClientRepository implements UserRepository {

    private final JdbcClient jdbcClient;

    public UserJdbcClientRepository(JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
    }

    @Override
    public User findByEmail(String email) throws DataAccessException{
        final String sql = """
            select user_id, email, password
            from `user`
            where email = ?
            """;

        return jdbcClient.sql(sql)
                .param(email)
                .query(new UserMapper())
                .optional()
                .orElse(null);
    }

    @Override
    public User create(User user) throws DataAccessException{
        final String sql = """
            insert into `user` (email, password)
            values (:email, :password);
            """;

        KeyHolder keyHolder = new GeneratedKeyHolder();

        int rowsAffected = jdbcClient.sql(sql)
                .param("email", user.getEmail())
                .param("password", user.getPassword())
                .update(keyHolder, "user_id");

        if (rowsAffected == 0) {
            return null;
        }

        user.setUserId(keyHolder.getKey().intValue());
        return user;
    }

}
