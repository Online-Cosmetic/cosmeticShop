package Midas.cosmeticshop.util;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;

/**
 * AiTEMS용 시간 변환 유틸리티
 * LocalDateTime ↔ epoch milliseconds 변환
 */
public class TimeConverter {

    /**
     * LocalDateTime을 epoch milliseconds로 변환
     * @param localDateTime LocalDateTime 객체
     * @return epoch milliseconds (long)
     */
    public static long toEpochMilliseconds(LocalDateTime localDateTime) {
        if (localDateTime == null) {
            return 0L;
        }
        return localDateTime.toInstant(ZoneOffset.UTC).toEpochMilli();
    }

    /**
     * epoch milliseconds를 LocalDateTime으로 변환
     * @param epochMilliseconds epoch milliseconds
     * @return LocalDateTime 객체 (UTC 기준)
     */
    public static LocalDateTime fromEpochMilliseconds(long epochMilliseconds) {
        return LocalDateTime.ofInstant(
            Instant.ofEpochMilli(epochMilliseconds),
            ZoneId.of("UTC")
        );
    }

    /**
     * LocalDateTime을 epoch seconds로 변환
     * @param localDateTime LocalDateTime 객체
     * @return epoch seconds (long)
     */
    public static long toEpochSeconds(LocalDateTime localDateTime) {
        if (localDateTime == null) {
            return 0L;
        }
        return localDateTime.toEpochSecond(ZoneOffset.UTC);
    }

    /**
     * epoch seconds를 LocalDateTime으로 변환
     * @param epochSeconds epoch seconds
     * @return LocalDateTime 객체 (UTC 기준)
     */
    public static LocalDateTime fromEpochSeconds(long epochSeconds) {
        return LocalDateTime.ofInstant(
            Instant.ofEpochSecond(epochSeconds),
            ZoneId.of("UTC")
        );
    }
}

