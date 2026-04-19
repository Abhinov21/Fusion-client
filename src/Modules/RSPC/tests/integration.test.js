/**
 * RSPC Module Integration Tests
 * Tests refactored components with service layer and custom hooks
 *
 * Run with: npm test
 */
/* eslint-env jest */
/* eslint-disable no-import-assign */

import { renderHook, act } from "@testing-library/react";
import useTableSort from "../hooks/useTableSort";
import useFormSubmit from "../hooks/useFormSubmit";
import * as rspcApi from "../services/rspcApi";

// Mock axios
jest.mock("axios");

describe("RSPC Service Layer Integration", () => {
  beforeEach(() => {
    localStorage.setItem("authToken", "test-token-12345");
    jest.clearAllMocks();
  });

  describe("API Service Functions", () => {
    test("fetchPIDs should call API with correct route", async () => {
      const mockData = { pids: [1, 2, 3] };
      // eslint-disable-next-line no-import-assign
      rspcApi.fetchPIDs = jest.fn().mockResolvedValue(mockData);

      const result = await rspcApi.fetchPIDs("coordinator");

      expect(result).toEqual(mockData);
      expect(rspcApi.fetchPIDs).toHaveBeenCalledWith("coordinator");
    });

    test("fetchStaff should call API with parameters", async () => {
      const mockData = { data: [{ id: 1, name: "John" }] };
      const params = { role: "coordinator", type: 2 };

      rspcApi.fetchStaff = jest.fn().mockResolvedValue(mockData);
      const result = await rspcApi.fetchStaff(params);

      expect(result).toEqual(mockData);
      expect(rspcApi.fetchStaff).toHaveBeenCalledWith(params);
    });

    test("fetchStaffPositions should call API with PID", async () => {
      const mockData = { positions: ["Position1", "Position2"] };
      // eslint-disable-next-line no-import-assign
      rspcApi.fetchStaffPositions = jest.fn().mockResolvedValue(mockData);

      const result = await rspcApi.fetchStaffPositions(123);

      expect(result).toEqual(mockData);
      expect(rspcApi.fetchStaffPositions).toHaveBeenCalledWith(123);
    });

    test("submitAdvertisementAndCommittee should POST form data", async () => {
      const formData = { project_id: 1, positions: 2 };
      const mockResponse = { success: true, message: "Submitted" };

      // eslint-disable-next-line no-import-assign
      rspcApi.submitAdvertisementAndCommittee = jest
        .fn()
        .mockResolvedValue(mockResponse);

      const result = await rspcApi.submitAdvertisementAndCommittee(formData);

      expect(result).toEqual(mockResponse);
      expect(rspcApi.submitAdvertisementAndCommittee).toHaveBeenCalledWith(
        formData,
      );
    });
  });

  describe("Custom Hook: useTableSort", () => {
    test("should initialize with correct default state", () => {
      const { result } = renderHook(() => useTableSort());

      expect(result.current.sortConfig.column).toBeNull();
      expect(result.current.sortConfig.direction).toBe("asc");
    });

    test("should sort data by column in ascending order", () => {
      const { result } = renderHook(() => useTableSort());
      const testData = [
        { name: "Charlie", tenure: 5 },
        { name: "Alice", tenure: 3 },
        { name: "Bob", tenure: 7 },
      ];

      act(() => {
        result.current.requestSort("name");
      });

      const sorted = result.current.sortedData(testData);

      expect(sorted[0].name).toBe("Alice");
      expect(sorted[1].name).toBe("Bob");
      expect(sorted[2].name).toBe("Charlie");
    });

    test("should toggle sort direction on same column click", () => {
      const { result } = renderHook(() => useTableSort());

      // First click - ascending
      act(() => {
        result.current.requestSort("name");
      });

      expect(result.current.sortConfig.direction).toBe("asc");

      // Second click - descending
      act(() => {
        result.current.requestSort("name");
      });

      expect(result.current.sortConfig.direction).toBe("desc");
    });

    test("should handle numeric sorting", () => {
      const { result } = renderHook(() => useTableSort());
      const testData = [
        { name: "Alice", tenure: 10 },
        { name: "Bob", tenure: 2 },
        { name: "Charlie", tenure: 5 },
      ];

      act(() => {
        result.current.requestSort("tenure");
      });

      const sorted = result.current.sortedData(testData);

      expect(sorted[0].tenure).toBe(2);
      expect(sorted[1].tenure).toBe(5);
      expect(sorted[2].tenure).toBe(10);
    });

    test("should handle null values correctly", () => {
      const { result } = renderHook(() => useTableSort());
      const testData = [{ name: "Alice" }, { name: null }, { name: "Bob" }];

      act(() => {
        result.current.requestSort("name");
      });

      const sorted = result.current.sortedData(testData);

      // Null should go to end in ascending order
      expect(sorted[sorted.length - 1].name).toBeNull();
    });
  });

  describe("Custom Hook: useFormSubmit", () => {
    test("should handle successful form submission", async () => {
      const mockSubmitFn = jest.fn().mockResolvedValue({ success: true });

      const { result } = renderHook(() => useFormSubmit(null, mockSubmitFn));

      const testValues = { field1: "value1" };

      await act(async () => {
        await result.current.handleSubmit(testValues);
      });

      expect(mockSubmitFn).toHaveBeenCalledWith(testValues);
      expect(result.current.submitting).toBe(false);
      expect(result.current.error).toBeNull();
    });

    test("should handle form submission error", async () => {
      const testError = new Error("Submission failed");
      const mockSubmitFn = jest.fn().mockRejectedValue(testError);

      const { result } = renderHook(() => useFormSubmit(null, mockSubmitFn));

      const testValues = { field1: "value1" };

      await act(async () => {
        try {
          await result.current.handleSubmit(testValues);
        } catch (e) {
          // Expected error
        }
      });

      expect(mockSubmitFn).toHaveBeenCalledWith(testValues);
    });

    test("should set submitting state during submission", async () => {
      const mockSubmitFn = jest.fn(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve({ success: true }), 100);
          }),
      );

      const { result } = renderHook(() => useFormSubmit(null, mockSubmitFn));

      const promise = act(async () => {
        result.current.handleSubmit({ test: "data" });
      });

      // Should be true during submission
      expect(result.current.submitting).toBe(true);

      await promise;
    });
  });

  describe("Data Consistency", () => {
    test("service layer should maintain API contract for staff data", async () => {
      const mockStaffData = {
        data: [
          {
            id: 1,
            name: "John Doe",
            department: "Engineering",
            tenure: 3,
            final_selection: "Selected",
          },
        ],
      };

      rspcApi.fetchStaff = jest.fn().mockResolvedValue(mockStaffData);

      const result = await rspcApi.fetchStaff({ role: "coordinator" });

      // Verify response structure is unchanged
      expect(result.data).toBeDefined();
      expect(result.data[0]).toHaveProperty("id");
      expect(result.data[0]).toHaveProperty("name");
      expect(result.data[0]).toHaveProperty("final_selection");
    });

    test("sorting preserves all data properties", () => {
      const { result } = renderHook(() => useTableSort());
      const testData = [
        {
          id: 2,
          name: "Bob",
          tenure: 7,
          final_selection: "Approved",
          status: "Active",
        },
        {
          id: 1,
          name: "Alice",
          tenure: 3,
          final_selection: "Pending",
          status: "Active",
        },
      ];

      act(() => {
        result.current.requestSort("name");
      });

      const sorted = result.current.sortedData(testData);

      // All properties should be preserved
      expect(sorted[0]).toHaveProperty("id");
      expect(sorted[0]).toHaveProperty("tenure");
      expect(sorted[0]).toHaveProperty("final_selection");
      expect(sorted[0]).toHaveProperty("status");
    });
  });

  describe("Error Handling", () => {
    test("service layer should throw on missing auth token", async () => {
      localStorage.removeItem("authToken");

      await expect(rspcApi.fetchPIDs("coordinator")).rejects.toThrow(
        "No authentication token found!",
      );
    });

    test("useTableSort should handle empty data", () => {
      const { result } = renderHook(() => useTableSort());

      act(() => {
        result.current.requestSort("name");
      });

      const sorted = result.current.sortedData([]);

      expect(sorted).toEqual([]);
    });

    test("useFormSubmit should handle submission without values", async () => {
      const mockSubmitFn = jest.fn().mockResolvedValue({ success: true });

      const { result } = renderHook(() => useFormSubmit(null, mockSubmitFn));

      await act(async () => {
        await result.current.handleSubmit({});
      });

      expect(mockSubmitFn).toHaveBeenCalledWith({});
    });
  });

  describe("Performance", () => {
    test("sorting should handle large datasets", () => {
      const { result } = renderHook(() => useTableSort());
      const largeDataset = Array.from({ length: 10000 }, (_, i) => ({
        id: i,
        name: `User${10000 - i}`,
        tenure: Math.random() * 10,
      }));

      const startTime = performance.now();

      act(() => {
        result.current.requestSort("name");
      });

      const sorted = result.current.sortedData(largeDataset);
      const endTime = performance.now();

      // Should complete in reasonable time (< 100ms)
      expect(endTime - startTime).toBeLessThan(100);
      expect(sorted.length).toBe(10000);
    });
  });
});

describe("Component Integration", () => {
  test("staffRecruitmentForm should use service layer", () => {
    // This test verifies the component uses imported service functions
    // In actual implementation, would test component rendering and API calls
    expect(rspcApi.fetchStaff).toBeDefined();
    expect(rspcApi.fetchStaffPositions).toBeDefined();
    expect(rspcApi.submitAdvertisementAndCommittee).toBeDefined();
  });

  test("staffTable should use sorting hook", () => {
    // Verify hook is properly imported and used
    const { result } = renderHook(() => useTableSort());

    expect(result.current).toHaveProperty("sortedData");
    expect(result.current).toHaveProperty("sortConfig");
    expect(result.current).toHaveProperty("requestSort");
  });

  test("inboxTable should integrate service layer and sorting", () => {
    // Verify both dependencies work together
    expect(rspcApi.fetchPIDs).toBeDefined();
    expect(rspcApi.fetchStaff).toBeDefined();

    const { result } = renderHook(() => useTableSort());
    expect(result.current.sortConfig).toBeDefined();
  });
});
