package learn.travelplanner.models;

import java.time.LocalDate;
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

    public Trip() {
    }

    public Trip(int tripId, String country, String city, LocalDate startDate, LocalDate endDate, String notes, User owner, boolean isTemplate) {
        this.tripId = tripId;
        this.country = country;
        this.city = city;
        this.startDate = startDate;
        this.endDate = endDate;
        this.notes = notes;
        this.owner = owner;
        this.isTemplate = isTemplate;
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


}
