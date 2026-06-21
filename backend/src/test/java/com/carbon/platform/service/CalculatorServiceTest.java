package com.carbon.platform.service;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class CalculatorServiceTest {

    private final CalculatorService calculatorService = new CalculatorService();

    @Test
    public void testCalculateTransport_ValidInputs() {
        assertEquals(2.1, calculatorService.calculateTransport("car", 10), 0.001);
        assertEquals(0.8, calculatorService.calculateTransport("bike", 10), 0.001);
        assertEquals(1.0, calculatorService.calculateTransport("bus", 10), 0.001);
        assertEquals(0.0, calculatorService.calculateTransport("cycle", 100), 0.001);
    }

    @Test
    public void testCalculateElectricity_ValidInput() {
        assertEquals(82.0, calculatorService.calculateElectricity(100), 0.001);
        assertEquals(0.0, calculatorService.calculateElectricity(0), 0.001);
    }

    @Test
    public void testCalculateFood_ValidInputs() {
        assertEquals(1.5, calculatorService.calculateFood("vegetarian"));
        assertEquals(3.0, calculatorService.calculateFood("mixed"));
        assertEquals(5.0, calculatorService.calculateFood("nonveg"));
    }

    @Test
    public void testCalculateShopping_ValidInputs() {
        assertEquals(5.0, calculatorService.calculateShopping("low"));
        assertEquals(15.0, calculatorService.calculateShopping("medium"));
        assertEquals(30.0, calculatorService.calculateShopping("high"));
    }
}
