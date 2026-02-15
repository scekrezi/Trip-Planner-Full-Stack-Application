package learn.travelplanner.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.time.LocalDate;
import java.util.List;

public class TripDay {
    private int tripDayId;
    private LocalDate dayDate;
    private String dayNotes;
    @JsonIgnoreProperties({"days"})
    private Trip trip;
    private List<Activity> activities;


    public TripDay() {
    }

    public TripDay(List<Activity> activities, Trip trip, String dayNotes, LocalDate dayDate, int tripDayId) {
        this.activities = activities;
        this.trip = trip;
        this.dayNotes = dayNotes;
        this.dayDate = dayDate;
        this.tripDayId = tripDayId;
    }

    public Trip getTrip() {
        return trip;
    }

    public void setTrip(Trip trip) {
        this.trip = trip;
    }

    public int getTripDayId() {
        return tripDayId;
    }

    public void setTripDayId(int tripDayId) {
        this.tripDayId = tripDayId;
    }

    public LocalDate getDayDate() {
        return dayDate;
    }

    public void setDayDate(LocalDate dayDate) {
        this.dayDate = dayDate;
    }

    public String getDayNotes() {
        return dayNotes;
    }

    public void setDayNotes(String dayNotes) {
        this.dayNotes = dayNotes;
    }

    public List<Activity> getActivities() {
        return activities;
    }

    public void setActivities(List<Activity> activities) {
        this.activities = activities;
    }
}
