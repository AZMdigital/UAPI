package com.azm.apihub.integrations.baseServices.models;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ServiceHead {
   private Long id;
   private String name;
   private String description;
   private ServiceProvider serviceProvider;
   private String industry;
   private String swaggerPath;
   private boolean active;
   private Timestamp createdAt;
   private List<Service> services = new ArrayList<>();
}
