package Midas.cosmeticshop.service;

import com.google.analytics.data.v1beta.*;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.auth.oauth2.ServiceAccountCredentials;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GoogleAnalyticsService {

    @Value("${google.analytics.property-id}")
    private String propertyId;

    @Value("${google.analytics.credentials-path}")
    private Resource credentialsResource;

    private BetaAnalyticsDataClient getClient() throws IOException {
        InputStream credentialsStream = credentialsResource.getInputStream();
        GoogleCredentials credentials = ServiceAccountCredentials.fromStream(credentialsStream);
        
        return BetaAnalyticsDataClient.create(
            BetaAnalyticsDataSettings.newBuilder()
                .setCredentialsProvider(() -> credentials)
                .build()
        );
    }

    /**
     * 방문자 수 조회 (일별)
     */
    public Map<String, Object> getDailyVisitors(String startDate, String endDate) throws IOException {
        try (BetaAnalyticsDataClient client = getClient()) {
            RunReportRequest request = RunReportRequest.newBuilder()
                .setProperty("properties/" + propertyId)
                .addDateRanges(DateRange.newBuilder()
                    .setStartDate(startDate)
                    .setEndDate(endDate))
                .addMetrics(Metric.newBuilder().setName("activeUsers"))
                .addDimensions(Dimension.newBuilder().setName("date"))
                .build();

            RunReportResponse response = client.runReport(request);

            Map<String, Object> result = new HashMap<>();
            List<Map<String, String>> data = new ArrayList<>();

            for (Row row : response.getRowsList()) {
                Map<String, String> rowData = new HashMap<>();
                rowData.put("date", row.getDimensionValues(0).getValue());
                rowData.put("visitors", row.getMetricValues(0).getValue());
                data.add(rowData);
            }

            result.put("data", data);
            if (response.getTotalsCount() > 0) {
                result.put("totalVisitors", response.getTotals(0).getMetricValues(0).getValue());
            } else {
                result.put("totalVisitors", "0");
            }
            return result;
        }
    }

    /**
     * 실시간 방문자 수 조회
     */
    public Map<String, Object> getRealtimeVisitors() throws IOException {
        try (BetaAnalyticsDataClient client = getClient()) {
            RunRealtimeReportRequest request = RunRealtimeReportRequest.newBuilder()
                .setProperty("properties/" + propertyId)
                .addMetrics(Metric.newBuilder().setName("activeUsers"))
                .build();

            RunRealtimeReportResponse response = client.runRealtimeReport(request);

            Map<String, Object> result = new HashMap<>();
            if (response.getRowsCount() > 0) {
                result.put("realtimeVisitors", 
                    response.getRows(0).getMetricValues(0).getValue());
            } else {
                result.put("realtimeVisitors", "0");
            }
            return result;
        }
    }

    /**
     * 페이지뷰 통계 조회
     */
    public Map<String, Object> getPageViews(String startDate, String endDate) throws IOException {
        try (BetaAnalyticsDataClient client = getClient()) {
            RunReportRequest request = RunReportRequest.newBuilder()
                .setProperty("properties/" + propertyId)
                .addDateRanges(DateRange.newBuilder()
                    .setStartDate(startDate)
                    .setEndDate(endDate))
                .addMetrics(Metric.newBuilder().setName("screenPageViews"))
                .addDimensions(Dimension.newBuilder().setName("date"))
                .build();

            RunReportResponse response = client.runReport(request);

            Map<String, Object> result = new HashMap<>();
            List<Map<String, String>> data = new ArrayList<>();

            for (Row row : response.getRowsList()) {
                Map<String, String> rowData = new HashMap<>();
                rowData.put("date", row.getDimensionValues(0).getValue());
                rowData.put("pageViews", row.getMetricValues(0).getValue());
                data.add(rowData);
            }

            result.put("data", data);
            if (response.getTotalsCount() > 0) {
                result.put("totalPageViews", response.getTotals(0).getMetricValues(0).getValue());
            } else {
                result.put("totalPageViews", "0");
            }
            return result;
        }
    }

    /**
     * 인기 페이지 조회
     */
    public Map<String, Object> getTopPages(String startDate, String endDate, int limit) throws IOException {
        try (BetaAnalyticsDataClient client = getClient()) {
            RunReportRequest request = RunReportRequest.newBuilder()
                .setProperty("properties/" + propertyId)
                .addDateRanges(DateRange.newBuilder()
                    .setStartDate(startDate)
                    .setEndDate(endDate))
                .addMetrics(Metric.newBuilder().setName("screenPageViews"))
                .addDimensions(Dimension.newBuilder().setName("pagePath"))
                .setLimit(limit)
                .addOrderBys(OrderBy.newBuilder()
                    .setMetric(OrderBy.MetricOrderBy.newBuilder()
                        .setMetricName("screenPageViews"))
                    .setDesc(true))
                .build();

            RunReportResponse response = client.runReport(request);

            Map<String, Object> result = new HashMap<>();
            List<Map<String, String>> data = new ArrayList<>();

            for (Row row : response.getRowsList()) {
                Map<String, String> rowData = new HashMap<>();
                rowData.put("pagePath", row.getDimensionValues(0).getValue());
                rowData.put("pageViews", row.getMetricValues(0).getValue());
                data.add(rowData);
            }

            result.put("data", data);
            return result;
        }
    }

    /**
     * 사용자 통계 요약 (기간별)
     */
    public Map<String, Object> getVisitorSummary(String startDate, String endDate) throws IOException {
        try (BetaAnalyticsDataClient client = getClient()) {
            RunReportRequest request = RunReportRequest.newBuilder()
                .setProperty("properties/" + propertyId)
                .addDateRanges(DateRange.newBuilder()
                    .setStartDate(startDate)
                    .setEndDate(endDate))
                .addMetrics(Metric.newBuilder().setName("activeUsers"))
                .addMetrics(Metric.newBuilder().setName("newUsers"))
                .addMetrics(Metric.newBuilder().setName("screenPageViews"))
                .addMetrics(Metric.newBuilder().setName("averageSessionDuration"))
                .build();

            RunReportResponse response = client.runReport(request);

            Map<String, Object> result = new HashMap<>();
            if (response.getTotalsCount() > 0) {
                Row totals = response.getTotals(0);
                result.put("activeUsers", totals.getMetricValues(0).getValue());
                result.put("newUsers", totals.getMetricValues(1).getValue());
                result.put("pageViews", totals.getMetricValues(2).getValue());
                result.put("avgSessionDuration", totals.getMetricValues(3).getValue());
            } else {
                result.put("activeUsers", "0");
                result.put("newUsers", "0");
                result.put("pageViews", "0");
                result.put("avgSessionDuration", "0");
            }
            return result;
        }
    }
}

