package com.demo;

import java.util.List;
import java.util.stream.Collectors;


public class Fleet {

    /**
     * Retrieves a list of predefined spaceship instances.
     *
     * @return List of Spaceship records with hardcoded data.
     */
    public static List<Spaceship> getSpaceships() {
        return List.of(
                new Spaceship("Ares", 10, true, List.of("Mars", "Jupiter")),
                new Spaceship("Venusian", 6, false, List.of("Venus")),
                new Spaceship("Saturnian", 8, true, List.of("Saturn", "Earth")),
                new Spaceship("Mercurian", 4, false, List.of("Mercury")),
                new Spaceship("Plutonian", 12, true, List.of("Neptune", "Pluto")),
                new Spaceship("Galactus", 20, true, List.of("Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto")),
                new Spaceship("Orion", 14, true, List.of("Mars", "Saturn", "Uranus")),
                new Spaceship("Pioneer", 16, false, List.of("Venus", "Earth", "Jupiter")),
                new Spaceship("Odyssey", 18, true, List.of("Mars", "Neptune", "Pluto")),
                new Spaceship("Voyager", 22, false, List.of("Earth", "Saturn", "Uranus", "Neptune")),
                new Spaceship("Explorer", 24, false, List.of("Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto")),
                new Spaceship("Nova", 26, false, List.of("Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto"))
        );
    }


    /**
     * Finds compatible spaceships based on the request criteria.
     *
     * @param userQuery The SpaceshipQuery containing passenger count, cargo requirement, and destinations.
     * @return A list of Spaceship instances that meet the passenger capacity, cargo bay, and destination requirements.
     */
    public static List<Spaceship> findCompatibleSpaceships(SpaceshipQuery userQuery) {
        return getSpaceships().stream()
                .filter(spaceship -> spaceship.maxPassengers() >= userQuery.passengers())
                .filter(spaceship -> (userQuery.hasCargo() && spaceship.hasCargoBay()) || !userQuery.hasCargo())
                .filter(spaceship -> spaceship.allowedDestinations().containsAll(userQuery.destinations()))
                .collect(Collectors.toList());
    }
}