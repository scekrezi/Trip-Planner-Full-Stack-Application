package learn.travelplanner.data;

import learn.travelplanner.models.Trip;
import org.springframework.dao.DataAccessException;

import java.util.List;

public interface TripsRepository {
    List<Trip> findTemplates() throws DataAccessException;

    Trip findById(int tripId) throws DataAccessException;

    Trip create(Trip Trip);

}

