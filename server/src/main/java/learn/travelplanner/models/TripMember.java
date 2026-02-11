package learn.travelplanner.models;

import java.util.Objects;

public class TripMember {
    private Trip trip;
    private User user;
    private String role;

    public TripMember() {
    }

    public TripMember(Trip trip, User user, String role) {
        this.trip = trip;
        this.user = user;
        this.role = role;
    }

    public Trip getTrip() {
        return trip;
    }

    public void setTrip(Trip trip) {
        this.trip = trip;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

}
