package learn.travelplanner.data;

import learn.travelplanner.models.TripDay;
import org.springframework.dao.DataAccessException;

import java.util.List;

public interface TripDayRepository {
    List<TripDay> findByTripId(int tripId) throws DataAccessException;

    TripDay create(TripDay tripDay) throws DataAccessException;
}
