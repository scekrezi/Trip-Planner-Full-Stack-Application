package learn.travelplanner.models;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

public class Trip {
    private int tripId;
    private String country;
    private String city;
    private LocalDate startDate;
    private LocalDate endDate;
    private String notes;
    private User owner;
    private boolean isTemplate;
    private List<TripDay> days;

    public Trip() {
    }

    public Trip(User owner, int tripId, String country, String city, LocalDate startDate, LocalDate endDate, String notes, boolean isTemplate, List<TripDay> days) {
        this.owner = owner;
        this.tripId = tripId;
        this.country = country;
        this.city = city;
        this.startDate = startDate;
        this.endDate = endDate;
        this.notes = notes;
        this.isTemplate = isTemplate;
        this.days = days;
    }

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    public int getTripId() {
        return tripId;
    }

    public void setTripId(int tripId) {
        this.tripId = tripId;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public boolean isTemplate() {
        return isTemplate;
    }

    public void setTemplate(boolean template) {
        isTemplate = template;
    }

    public List<TripDay> getDays() {
        return days;
    }

    public void setDays(List<TripDay> days) {
        this.days = days;
    }
}
