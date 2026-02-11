package learn.travelplanner.controllers;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import learn.travelplanner.domain.Result;
import learn.travelplanner.domain.UserService;
import learn.travelplanner.models.User;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/api/user")
@CrossOrigin
public class UserController {
    private final UserService service;


    public UserController(UserService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Object> create(@RequestBody User user) throws DataAccessException {
        Result<User> result = service.create(user);

        if (!result.isSuccess()) {
            return ErrorResponse.build(result);
        }
        return new ResponseEntity<>(result.getPayload(), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestBody User user) throws DataAccessException, JsonProcessingException {
        Result<User> lookupResult = service.findByEmail(user.getEmail());
        if (!lookupResult.isSuccess()) {
            return ErrorResponse.build(lookupResult);
        }

        int hashedIncomingPassword = Objects.hash(user.getPassword());
        String stringHashedIncomingPassword = String.valueOf(hashedIncomingPassword);

        if (lookupResult.getPayload().getPassword().equals(stringHashedIncomingPassword)) {

            ObjectMapper jsonWriter = new ObjectMapper();
            String userJson = jsonWriter.writeValueAsString(lookupResult.getPayload());
            String userDataPlusSecret = userJson + "backend-secret";
            int signature = Objects.hash(userDataPlusSecret);

            String diyJwt = userJson + "|" + signature;

            Map<String, String> diyJwtMap = new HashMap<>();
            diyJwtMap.put("diyJwt", diyJwt);

            return new ResponseEntity<>(diyJwtMap, HttpStatus.OK);


        } else {
            return new ResponseEntity<>(List.of("Incorrect password"), HttpStatus.UNAUTHORIZED);
        }
    }
}