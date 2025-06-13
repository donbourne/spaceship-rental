package com.demo;

import java.util.List;

import dev.langchain4j.model.output.structured.Description;

@Description("A request for a compatible spaceship")
public record SpaceshipQuery(int passengers, boolean hasCargo, List<String> destinations) {
    
}
