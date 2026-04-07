package com.inventrix.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "warehouses")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Warehouse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String location;
    private String address;

    @Column(name = "contact_number")
    private String contactNumber;

    // Prevent infinite JSON loop
    @JsonIgnore
    @OneToMany(mappedBy = "warehouse", cascade = CascadeType.ALL)
    private List<Product> products = new ArrayList<>();
}