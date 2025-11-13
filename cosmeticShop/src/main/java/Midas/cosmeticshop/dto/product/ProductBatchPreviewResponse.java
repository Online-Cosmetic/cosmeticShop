package Midas.cosmeticshop.dto.product;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class ProductBatchPreviewResponse {
    private List<ProductPreviewDTO> batchesPreviews = new ArrayList<>();
    private boolean hasNext;
    private long totalElements;
    private int page;
    private int pageSize;
}
