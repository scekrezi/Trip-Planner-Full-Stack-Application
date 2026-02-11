package learn.travelplanner.models;

import java.time.LocalDate;
import java.util.Objects;

public class TripDay {
    private int tripDayId;
    private LocalDate dayDate;
    private String dayNotes;
    private Trip trip;

    public TripDay() {
    }

    public TripDay(int tripDayId, LocalDate dayDate, String dayNotes, Trip trip) {
        this.tripDayId = tripDayId;
        this.dayDate = dayDate;
        this.dayNotes = dayNotes;
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

    public Trip getTrip() {
        return trip;
    }

    public void setTrip(Trip trip) {
        this.trip = trip;
    }

}
