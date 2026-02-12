package learn.travelplanner.data;

import learn.travelplanner.models.Activity;
import org.springframework.dao.DataAccessException;

import java.util.List;

public interface ActivityRepository {
    List<Activity> findByTripId(int tripId) throws DataAccessException;
}
