package learn.travelplanner.domain;

import learn.travelplanner.data.ActivityRepository;
import learn.travelplanner.data.TripDayRepository;
import learn.travelplanner.data.TripsRepository;
import learn.travelplanner.models.Activity;
import learn.travelplanner.models.Trip;
import learn.travelplanner.models.TripDay;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
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

    public Trip createTripWithDetails(Trip trip) {
        if (trip == null) {
            throw new IllegalArgumentException("Trip cannot null");
        }
        if (trip.getOwner() == null || trip.getOwner().getUserId() <= 0) {
            throw new IllegalArgumentException("Trip owner is required");
        }
        if (trip.getNotes() == null) {
            trip.setNotes("");
        }
        if (trip.getCountry() == null || trip.getCountry().isBlank()) {
            throw new IllegalArgumentException("Country is required.");
        }

        if (trip.getCity() == null || trip.getCity().isBlank()) {
            throw new IllegalArgumentException("City is required.");
        }



        Trip savedTrip = repository.create(trip);
        if (savedTrip == null) {
            throw new IllegalStateException("Unable to create trip.");
        }

        if (trip.getDays() != null) {

            for (TripDay day : trip.getDays()) {

                day.setTrip(savedTrip);

                TripDay savedDay = tripDayRepository.create(day);
                if (savedDay == null) {
                    throw new IllegalStateException("Unable to create trip day.");
                }

                if (day.getActivities() != null) {

                    int orderIndex = 1;

                    for (Activity activity : day.getActivities()) {

                        activity.setTripDay(savedDay);
                        activity.setCreatedBy(savedTrip.getOwner());

                        activity.setOrderIndex(orderIndex++);

                        Activity savedActivity = activityRepository.create(activity);
                        if (savedActivity == null) {
                            throw new IllegalStateException("Unable to create activity.");
                        }
                    }
                }
            }
        }

        return savedTrip;
    }

    public List<Trip> findByOwnerId(int ownerId) {
        return repository.findByOwnerId(ownerId);
    }


    public List<Trip> findUpcomingByOwnerId(int ownerId) {

        List<Trip> all = findByOwnerId(ownerId);
        List<Trip> upcoming = new ArrayList<>();

        LocalDate today = LocalDate.now();

        for (Trip t : all) {
            if (t.getEndDate() == null || !t.getEndDate().isBefore(today)) {
                upcoming.add(t);
            }
        }

        return upcoming;
    }

    public List<Trip> findPastByOwnerId(int ownerId) {

        List<Trip> all = findByOwnerId(ownerId);
        List<Trip> past = new ArrayList<>();

        LocalDate today = LocalDate.now();

        for (Trip t : all) {
            if (t.getEndDate() != null && t.getEndDate().isBefore(today)) {
                past.add(t);
            }
        }

        return past;
    }

    public Result<Trip> deleteById(int tripId, int ownerUserId) {
        Result<Trip> result = new Result<>();

        if (tripId <= 0) {
            result.addErrorMessage("Trip id must be greater than 0.", ResultType.INVALID);
            return result;
        }

        if (ownerUserId <= 0) {
            result.addErrorMessage("User id must be greater than 0.", ResultType.INVALID);
            return result;
        }

        boolean deleted = repository.deleteById(tripId, ownerUserId);

        if (!deleted) {
            result.addErrorMessage("Trip not found or you are not the owner.", ResultType.NOT_FOUND);
        }

        return result;
    }

    public List<Trip> findInvitedByUserId(int userId) {
        return repository.findInvitedByUserId(userId);
    }

    public List<Trip> findUpcomingInvited(int userId) {

        List<Trip> all = findInvitedByUserId(userId);
        List<Trip> upcoming = new ArrayList<>();

        LocalDate today = LocalDate.now();

        for (Trip t : all) {
            if (t.getEndDate() == null || !t.getEndDate().isBefore(today)) {
                upcoming.add(t);
            }
        }

        return upcoming;
    }

    public List<Trip> findPastInvited(int userId) {

        List<Trip> all = findInvitedByUserId(userId);
        List<Trip> past = new ArrayList<>();

        LocalDate today = LocalDate.now();

        for (Trip t : all) {
            if (t.getEndDate() != null && t.getEndDate().isBefore(today)) {
                past.add(t);
            }
        }

        return past;
    }


}
