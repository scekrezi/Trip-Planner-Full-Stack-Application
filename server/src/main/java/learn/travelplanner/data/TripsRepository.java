package learn.travelplanner.data;

import learn.travelplanner.models.Trip;

import java.util.List;

public interface TripsRepository {
    List<Trip> findTemplates();
}
