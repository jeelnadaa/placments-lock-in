import java.util.*;

class MedianFinder {
    private java.util.PriorityQueue<Integer> small = new java.util.PriorityQueue<>(Collections.reverseOrder());
    private java.util.PriorityQueue<Integer> large = new java.util.PriorityQueue<>();

    public MedianFinder() {}

    public void addNum(int num) {
        small.offer(num);
        large.offer(small.poll());
        if (small.size() < large.size()) {
            small.offer(large.poll());
        }
    }

    public double findMedian() {
        if (small.size() > large.size()) {
            return small.peek();
        } else {
            return (small.peek() + large.peek()) / 2.0;
        }
    }
}
