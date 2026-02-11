package learn.travelplanner.controllers;

import learn.travelplanner.domain.TripService;
import learn.travelplanner.models.Trip;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
