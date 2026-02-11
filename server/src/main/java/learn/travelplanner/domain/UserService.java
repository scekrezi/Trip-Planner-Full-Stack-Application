package learn.travelplanner.domain;

import learn.travelplanner.data.UserRepository;
import learn.travelplanner.models.User;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
public class UserService {
    private final UserRepository repository;

    public UserService(UserRepository repository) {
        this.repository = repository;
    }

    public Result<User> findByEmail(String email) throws DataAccessException {
        Result<User> result = new Result<>();

        if (email == null || email.isBlank()) {
            result.addErrorMessage("Email cannot be blank", ResultType.INVALID);
            return result;
        }

        User user = repository.findByEmail(email);
        if (user == null) {
            result.addErrorMessage("User not found", ResultType.NOT_FOUND);
        } else {
            result.setPayload(user);
        }

        return result;
    }

    public Result<User> create(User user) throws DataAccessException {
        Result<User> result = new Result<>();

        if (user == null) {
            result.addErrorMessage("User cannot be null", ResultType.INVALID);
            return result;
        }

        if (user.getEmail().isBlank()) {
            result.addErrorMessage("Email cannot be blank", ResultType.INVALID);
        }

        if (user.getPassword().isBlank()) {
            result.addErrorMessage("Password cannot be blank", ResultType.INVALID);
        }

        if (repository.findByEmail(user.getEmail()) != null) {
            result.addErrorMessage("Email is already taken", ResultType.INVALID);
        }

        if (result.isSuccess()) {
            int hashedPassword = Objects.hash(user.getPassword());
            String stringHashedPassword = String.valueOf(hashedPassword);
            user.setPassword(stringHashedPassword);
            User created = repository.create(user);
            result.setPayload(created);
        }

        return result;
    }

}
