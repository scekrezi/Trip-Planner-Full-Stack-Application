package learn.travelplanner.domain;

import learn.travelplanner.data.UserRepository;
import learn.travelplanner.models.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.dao.DataAccessException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;


@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
class UserServiceTest {
    @Autowired
    UserService service;

    @MockBean
    UserRepository repository;


    @Test
    void findByEmailHappyPath() throws DataAccessException {
        User existingUser = new User(1,"a@test.com", "passA" );

        when(repository.findByEmail("a@test.com")).thenReturn(existingUser);
        Result<User> actual = service.findByEmail(existingUser.getEmail());

        assertTrue(actual.isSuccess());
        assertEquals(existingUser, actual.getPayload());
    }

    @Test
    void findByEmailFailsToFind() throws DataAccessException {
        when(repository.findByEmail("email@doesnotexist")).thenReturn(null);

        Result<User> actual = service.findByEmail("email@doesnotexist");

        assertEquals(ResultType.NOT_FOUND, actual.getResultType());
        assertTrue(actual.getErrorMessages().contains("User not found"));
    }

    @Test
    void createFailsWhenEmailIsBlank() throws DataAccessException {
        User toCreate = new User(1,"", "test" );

        Result<User> actual = service.create(toCreate);

        assertEquals(ResultType.INVALID, actual.getResultType());
        assertTrue(actual.getErrorMessages().contains("Email cannot be blank"));
    }

    @Test
    void createFailsWhenPasswordIsBlank() throws DataAccessException {
        User toCreate = new User(1,"test@user.com", "" );

        Result<User> actual = service.create(toCreate);

        assertEquals(ResultType.INVALID, actual.getResultType());
        assertTrue(actual.getErrorMessages().contains("Password cannot be blank"));
    }

    @Test
    void createFailsWhenEmailIsDuplicate() throws DataAccessException {
        User existingUser = new User(1,"a@test.com", "passA" );
        User toCreate = new User(1,"test@user.com", "password" );

        when(repository.findByEmail("test@user.com")).thenReturn(existingUser);

        Result<User> actual = service.create(toCreate);

        assertEquals(ResultType.INVALID, actual.getResultType());
        assertTrue(actual.getErrorMessages().contains("Email is already taken"));
    }

    @Test
    void createHappyPath() throws DataAccessException {
        User toCreate = new User(0,"test@user.com", "password" );
        User afterCreate = new User(3,"test@user.com", "password" );

        when(repository.create(toCreate)).thenReturn(afterCreate);

        Result<User> actual = service.create(toCreate);

        assertTrue(actual.isSuccess());
        assertEquals(afterCreate, actual.getPayload());
    }
}