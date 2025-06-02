package Midas.cosmeticshop.dto.product;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class ProductBatchPreviewResponse {
    List<ProductPreviewDTO> batchesPreviews = new ArrayList<>();
}
