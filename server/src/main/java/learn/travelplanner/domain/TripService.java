package learn.travelplanner.domain;

import learn.travelplanner.data.ActivityRepository;
import learn.travelplanner.data.TripDayRepository;
import learn.travelplanner.data.TripsRepository;
import learn.travelplanner.models.Activity;
import learn.travelplanner.models.Trip;
import learn.travelplanner.models.TripDay;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class TripService {
    private final TripsRepository repository;
    private final TripDayRepository tripDayRepository;
    private final ActivityRepository activityRepository;

    public TripService(TripsRepository repository, TripDayRepository tripDayRepository, ActivityRepository activityRepository) {
        this.repository = repository;
        this.tripDayRepository = tripDayRepository;
        this.activityRepository = activityRepository;
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
    public Result<Trip> findByIdWithDetails(int tripId) {
        Result<Trip> result = new Result<>();

        Trip trip = repository.findById(tripId);

        if (trip == null) {
            result.addErrorMessage("Trip not found", ResultType.NOT_FOUND);
            return result;
        }

        List<TripDay> days = tripDayRepository.findByTripId(tripId);

        List<Activity> activities = activityRepository.findByTripId(tripId);

        for (TripDay day : days) {

            List<Activity> activitiesForThisDay = new ArrayList<>();

            for (Activity activity : activities) {
                int activityDayId = activity.getTripDay().getTripDayId();
                int currentDayId = day.getTripDayId();

                if (activityDayId == currentDayId) {
                    activitiesForThisDay.add(activity);
                }
            }

            day.setActivities(activitiesForThisDay);
        }

        trip.setDays(days);

        result.setPayload(trip);
        return result;
    }



}
