package com.azm.apihub.backend.utilities.models;

import com.azm.apihub.backend.utilities.models.deed.DeedDetails;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MongoResponseBody {
    DeedDetails deedDetails;
}