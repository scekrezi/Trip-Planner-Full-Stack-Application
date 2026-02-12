package learn.travelplanner.controllers;

import learn.travelplanner.domain.Result;
import learn.travelplanner.domain.TripService;
import learn.travelplanner.models.Trip;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
}
