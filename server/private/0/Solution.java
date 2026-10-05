import java.util.*;
import java.io.*;
import java.lang.*;

class Solution {
    public int[] runDiagnostic(int[] nums, String mode, int target) {
        if ("SUM".equals(mode)) {
            int sum = target;
            for (int x : nums) {
                sum += x;
            }
            return new int[]{sum};
        }
        if ("FILTER".equals(mode)) {
            List<Integer> list = new ArrayList<>();
            for (int x : nums) {
                if (x > target) {
                    list.add(x);
                }
            }
            int[] res = new int[list.size()];
            for (int i = 0; i < list.size(); i++) {
                res[i] = list.get(i);
            }
            return res;
        }
        if ("REVERSE".equals(mode)) {
            int[] res = new int[nums.length];
            for (int i = 0; i < nums.length; i++) {
                res[i] = nums[nums.length - 1 - i];
            }
            return res;
        }
        return new int[]{nums.length, target};
    }
}
