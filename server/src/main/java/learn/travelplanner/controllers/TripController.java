package learn.travelplanner.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import learn.travelplanner.domain.Result;
import learn.travelplanner.domain.TripService;
import learn.travelplanner.models.Trip;
import learn.travelplanner.models.User;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/api/trips")
@CrossOrigin
public class TripController {
    private final TripService service;

    public TripController(TripService service) {
        this.service = service;
    }

    @GetMapping("/templates")
    public List<Trip> findTemplates() {
        return service.findTemplates();
    }

    @GetMapping("/{tripId}")
    public ResponseEntity<Object> findById(@PathVariable int tripId) throws DataAccessException {
        Result<Trip> result = service.findById(tripId);
        if (!result.isSuccess()) {
            return ErrorResponse.build(result);
        }
        return new ResponseEntity<>(result.getPayload(), HttpStatus.OK);
    }

    @GetMapping("/{tripId}/details")
    public ResponseEntity<Object> findDetails(@PathVariable int tripId) {
        Result<Trip> result = service.findByIdWithDetails(tripId);

        if(!result.isSuccess()) {
            return ErrorResponse.build((result));
        }
        return new ResponseEntity<>(result.getPayload(), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Trip trip,
                                    @RequestHeader Map<String, String> headers)
            throws DataAccessException, JsonProcessingException {

        User user = getUserFromHeaders(headers);

        if (user == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        trip.setOwner(user);
        trip.setTemplate(false);

        Trip created = service.createTripWithDetails(trip);

        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }


    private User getUserFromHeaders(Map<String, String> headers) throws JsonProcessingException {
        String diyJwt = headers.get("authorization");
        if (diyJwt == null) {
            return null;
        } else {
            String userData = diyJwt.split("\\|")[0];
            int signature = Integer.parseInt(diyJwt.split("\\|")[1]);
            int reComputedSignature = Objects.hash(userData + "backend-secret");
            if (signature == reComputedSignature) {
                ObjectMapper jsonReader = new ObjectMapper();
                return jsonReader.readValue(userData, User.class);

            } else {
                return null;
            }
        }
    }

    @GetMapping("/mine/upcoming")
    public ResponseEntity<?> findMyUpcoming(@RequestHeader Map<String, String> headers) throws JsonProcessingException {
        User user = getUserFromHeaders(headers);
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        List<Trip> trips = service.findUpcomingByOwnerId(user.getUserId());
        return new ResponseEntity<>(trips, HttpStatus.OK);
    }

    @GetMapping("/mine/past")
    public ResponseEntity<?> findMyPast(@RequestHeader Map<String, String> headers) throws JsonProcessingException {
        User user = getUserFromHeaders(headers);
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        List<Trip> trips = service.findPastByOwnerId(user.getUserId());
        return new ResponseEntity<>(trips, HttpStatus.OK);
    }

}
