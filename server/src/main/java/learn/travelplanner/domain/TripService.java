package learn.travelplanner.domain;

import learn.travelplanner.data.TripsRepository;
import learn.travelplanner.models.Trip;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TripService {
    private final TripsRepository repository;

    public TripService(TripsRepository repository) {
        this.repository = repository;
    }

    public List<Trip> findTemplates() throws DataAccessException {
        return repository.findTemplates();
    }

    public Result<Trip> findById(int tripId) throws DataAccessException {
        Trip found = repository.findById(tripId);
        Result<Trip> result = new Result<>();

        if (found == null) {
            result.addErrorMessage("Trip not found", ResultType.NOT_FOUND);
        } else {
            result.setPayload(found);
        }
        return result;
    }

}
