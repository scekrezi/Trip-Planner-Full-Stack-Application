package learn.travelplanner.domain;

import learn.travelplanner.data.TripsRepository;
import learn.travelplanner.models.Trip;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TripService {
    private final TripsRepository repository;

    public TripService(TripsRepository repository) {
        this.repository = repository;
    }

    public List<Trip> findTemplates() {
        return repository.findTemplates();
    }

}
