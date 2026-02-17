package learn.travelplanner.domain;

import learn.travelplanner.data.TripMemberRepository;
import learn.travelplanner.data.TripsRepository;
import learn.travelplanner.data.UserRepository;
import learn.travelplanner.models.Trip;
import learn.travelplanner.models.TripMember;
import learn.travelplanner.models.User;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TripMemberService {
    private final TripsRepository tripRepository;
    private final UserRepository userRepository;
    private final TripMemberRepository tripMemberRepository;

    public TripMemberService(TripsRepository tripRepository, UserRepository userRepository, TripMemberRepository tripMemberRepository) {
        this.tripRepository = tripRepository;
        this.userRepository = userRepository;
        this.tripMemberRepository = tripMemberRepository;
    }

    public Result<TripMember> addMember(int tripId, String collaboratorEmail, String role) {
        Result<TripMember> result = new Result<>();

        if (tripId <= 0) {
            result.addErrorMessage("Trip ID is required.", ResultType.INVALID);
        }

        if (collaboratorEmail == null || collaboratorEmail.isBlank()) {
            result.addErrorMessage("Collaborator email is required.", ResultType.INVALID);
        }

        if (role == null || role.isBlank()) {
            result.addErrorMessage("Role is required.", ResultType.INVALID);
        }

        if (!result.isSuccess()) {
            return result;
        }
        Trip trip = tripRepository.findById(tripId);
        if (trip == null) {
            result.addErrorMessage("Trip not found.", ResultType.NOT_FOUND);
            return result;
        }

        User user = userRepository.findByEmail(collaboratorEmail);
        if (user == null) {
            result.addErrorMessage("User with that email does not exist.", ResultType.NOT_FOUND);
            return result;
        }

        TripMember member = new TripMember();
        member.setTrip(trip);
        member.setUser(user);
        member.setRole(role);

        try {
            TripMember added = tripMemberRepository.add(member);
            result.setPayload(added);
        } catch (DuplicateKeyException ex) {
            result.addErrorMessage("User is already a member of this trip.", ResultType.INVALID);
        }

        return result;
    }

    public Result<List<TripMember>> findMembers(int tripId) {

        Result<List<TripMember>> result = new Result<>();

        if (tripId <= 0) {
            result.addErrorMessage("Trip ID is required.", ResultType.INVALID);
            return result;
        }

        Trip trip = tripRepository.findById(tripId);
        if (trip == null) {
            result.addErrorMessage("Trip not found.", ResultType.NOT_FOUND);
            return result;
        }

        List<TripMember> members = tripMemberRepository.findByTripId(tripId);
        result.setPayload(members);

        return result;
    }
}
