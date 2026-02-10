package learn.travelplanner.data;

import learn.travelplanner.models.User;
import org.springframework.dao.DataAccessException;

public interface UserRepository {
    public User findByEmail(String email) throws DataAccessException;

    public User create(User user) throws DataAccessException;
}
