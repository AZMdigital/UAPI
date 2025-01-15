package com.azm.apihub.backend.users.controllers;

import com.azm.apihub.backend.ApiHubUtils;
import com.azm.apihub.backend.companies.models.CompanyNameDTO;
import com.azm.apihub.backend.configuration.rolesAndPermissions.RequiresPermission;
import com.azm.apihub.backend.entities.Company;
import com.azm.apihub.backend.entities.User;
import com.azm.apihub.backend.exceptions.BadRequestException;
import com.azm.apihub.backend.users.models.*;
import com.azm.apihub.backend.users.services.UserService;
import com.azm.apihub.backend.users.validator.TokenRequestValidator;
import com.azm.apihub.backend.users.validator.UserRequestValidator;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/v1/users")
@Tag(name = "User Management")
@AllArgsConstructor
@Slf4j
public class UserController {

    @Autowired
    private UserService userService;


    @Autowired
    private UserRequestValidator userRequestValidator;

    @Autowired
    private TokenRequestValidator tokenRequestValidator;

    @GetMapping
    @Operation(
            summary = "This Api is used to get all list of Users"
    )
    public ResponseEntity<UserResponse> findAllUsers(Authentication authentication,
                                                     @RequestParam(defaultValue = "1") int pageNumber,
                                                     @RequestParam(defaultValue = "10") int pageSize,
                                                     @RequestParam(required = false) String query,
                                                     @RequestParam(required = false) String companyName) {
        var startMillis = System.currentTimeMillis();
        UUID requestID = UUID.randomUUID();

        com.azm.apihub.backend.users.models.UserDetails userDetails = (com.azm.apihub.backend.users.models.UserDetails) authentication.getPrincipal();

        UserResponse userResponse;
        if(userDetails.isAdmin()) {
            log.info("Request received for Getting all Users for Admin with requestId:{}", requestID);
            userResponse = userService.getAllUsers(requestID, query, pageNumber, pageSize, companyName);

        } else {
            log.info("Request received for Getting all Users for Account with requestId:{}", requestID);
            userResponse = userService.getAllUsersForAccount(requestID, userDetails.getCompany().getId(), query, pageNumber, pageSize);
        }

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Get all Users service took {} ms", timeTook);

        return new ResponseEntity<>(userResponse, HttpStatus.OK);
    }

    @GetMapping("/admin/companyNames")
    public ResponseEntity<CompanyNameDTO> findAllCompanyNamesByUser()
    {
        List<String> companyNames = userService.getAllCompanyNamesForUsers();
        return new ResponseEntity<>(new CompanyNameDTO(companyNames), HttpStatus.OK);
    }

    @GetMapping("is-exist")
    @Operation(
            summary = "This Api is used to check whether the user is exist or not"
    )
    public ResponseEntity<UserExist> checkUserIsPresent(@RequestParam(name = "query") String query) {
        var startMillis = System.currentTimeMillis();
        UUID requestID = UUID.randomUUID();

        var result = userService.checkUserIsExist(requestID, query.trim());

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Check user is exist service took " + timeTook + " ms");

        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping(value = "account/{accountId}/user/{id}")
    @Operation(
            summary = "This Api is used to get user by id",
            parameters = {
                    @Parameter(name = "id", description = "The ID of the user"),
                    @Parameter(name = "accountId", description = "The ID of the user's account"),
            }
    )
    public ResponseEntity<User> findUserById(Authentication authentication,
                                             @PathVariable(name = "id") Long id,
                                             @PathVariable(name = "accountId") Long accountId) {
        var startMillis = System.currentTimeMillis();
        UUID requestID = UUID.randomUUID();

        com.azm.apihub.backend.users.models.UserDetails userDetails = (com.azm.apihub.backend.users.models.UserDetails) authentication.getPrincipal();

        User result;
        if(!userDetails.isAdmin()) {
            log.info("Request received for Getting user for account by ID: "+id+" with requestId:"+requestID);
            if(userDetails.getCompany().getId().compareTo(accountId) != 0)
                throw new BadRequestException("Account admin can only get info of user for it's account users");

            result = userService.getUserByIdAndAccountId(requestID, accountId, id);
        } else {
            log.info("Request received for Getting user by ID: "+id+" with requestId:"+requestID);
            result = userService.getUserById(requestID, id);
        }


        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Get user by id service took " + timeTook + " ms");

        return new ResponseEntity<>(result, HttpStatus.OK);

    }

    @GetMapping(value = "/~")
    @Operation(summary = "This Api is used to get info of logged in user")
    public ResponseEntity<User> findLoggedInUserDetails(Authentication authentication) {

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        var startMillis = System.currentTimeMillis();
        UUID requestID = UUID.randomUUID();
        log.info("Request received for Getting details of logged in user with requestId:"+requestID);
        var result = userService.getUserByUsername(userDetails.getUsername());

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Get logged user details service took " + timeTook + " ms");

        return new ResponseEntity<>(result, HttpStatus.OK);

    }


    @GetMapping(value = "/admin/~")
    @Operation(summary = "This Api is used to get info of logged in user")
    public ResponseEntity<User> findLoggedInAdminUserDetails(Authentication authentication) {

        com.azm.apihub.backend.users.models.UserDetails userDetails = (com.azm.apihub.backend.users.models.UserDetails) authentication.getPrincipal();
        User user = new User();
        user.setEmail(userDetails.getEmail());
        user.setLastName(userDetails.getLastName());
        user.setFirstName(userDetails.getFirstName());
        user.setUsername(userDetails.getUsername());
        var startMillis = System.currentTimeMillis();
        UUID requestID = UUID.randomUUID();
        log.info("Request received for Getting details of logged in user with requestId:"+requestID);
        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Get logged user details service took " + timeTook + " ms");
        return new ResponseEntity<>(user, HttpStatus.OK);

    }


    @GetMapping(value = "/~/company")
    @Operation(summary = "This Api is used to get company info of logged in user")
    public ResponseEntity<Company> findLoggedInUserCompanyDetails(Authentication authentication) {

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        var startMillis = System.currentTimeMillis();
        UUID requestID = UUID.randomUUID();
        log.info("Request received for Getting company details of logged in user with requestId:"+requestID);
        var result = userService.getUserByUsername(userDetails.getUsername()).getCompany();

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Get logged user company details service took " + timeTook + " ms");

        return new ResponseEntity<>(result, HttpStatus.OK);

    }

    @PostMapping
    @Operation(
            summary = "This Api is used to create a User",
            parameters = {
                    @Parameter(name = "userRequest", description = "The json body of User request"),
            }
    )
    @RequiresPermission({"user-add"})
    public ResponseEntity<User> createUser(Authentication authentication,
                                           @RequestBody @Validated UserRequest userRequest,
                                           BindingResult bindingResult) {
        var startMillis = System.currentTimeMillis();
        UUID requestID = UUID.randomUUID();

        userRequestValidator.validate(userRequest, bindingResult);
        ApiHubUtils.checkRequestErrors(bindingResult);

        com.azm.apihub.backend.users.models.UserDetails userDetails = (com.azm.apihub.backend.users.models.UserDetails) authentication.getPrincipal();

        if(!userDetails.isAdmin()) {
            log.info("Request received for creating User for Account with requestId:"+requestID);

            userRequest.setCompanyId(userDetails.getCompany().getId());
        } else {
            log.info("Request received for creating User with requestId:"+requestID);
        }

        User result = userService.createUser(requestID, userRequest);

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Create User service took " + timeTook + " ms");

        return new ResponseEntity<>(result, HttpStatus.CREATED);

    }

    @PutMapping(value = "/{id}")
    @Operation(
            summary = "This Api is used to update a User by id",
            parameters = {
                    @Parameter(name = "id", description = "The id of the User"),
                    @Parameter(name = "userRequest", description = "The json body of User request"),
            }
    )
    @RequiresPermission({"user-edit"})
    public ResponseEntity<User> updateUser(Authentication authentication,
                                           @PathVariable Long id,
                                           @RequestBody @Validated UpdateUserRequest updateUserRequest,
                                           BindingResult bindingResult) {
        var startMillis = System.currentTimeMillis();
        UUID requestID = UUID.randomUUID();


        userRequestValidator.validate(updateUserRequest, bindingResult);
        ApiHubUtils.checkRequestErrors(bindingResult);

        com.azm.apihub.backend.users.models.UserDetails userDetails = (com.azm.apihub.backend.users.models.UserDetails) authentication.getPrincipal();

        if(!userDetails.isAdmin()) {
            log.info("Request received for updating User for account by ID: "+id+" with requestId:"+requestID);

            updateUserRequest.setCompanyId(userDetails.getCompany().getId());
        } else {
            log.info("Request received for updating User by ID: "+id+" with requestId:"+requestID);
        }

        var result = userService.updateUser(requestID, id, updateUserRequest, false);

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;

        log.info("Updating User service took " + timeTook + " ms");

        return new ResponseEntity<>(result, HttpStatus.OK);

    }

    @DeleteMapping(value = "/account/{accountId}/user/{id}")
    @Operation(
            summary = "This Api is used to delete a User by id",
            parameters = {
                    @Parameter(name = "id", description = "The id of the User"),
                    @Parameter(name = "accountId", description = "The id of the User's Account"),
            }
    )
    @RequiresPermission({"user-delete"})
    public ResponseEntity<User> deleteUser(Authentication authentication, @PathVariable Long id, @PathVariable Long accountId) {
        var startMillis = System.currentTimeMillis();
        UUID requestID = UUID.randomUUID();

        com.azm.apihub.backend.users.models.UserDetails userDetails = (com.azm.apihub.backend.users.models.UserDetails) authentication.getPrincipal();

        if(!userDetails.isAdmin()) {
            log.info("Request received for deleting User for account by ID: "+id+" with requestId:"+requestID);
            if(userDetails.getCompany().getId().compareTo(accountId) != 0)
                throw new BadRequestException("Account admin can only delete it's account users");

            userService.deleteUser(accountId, id, true);
        } else {
            log.info("Request received for deleting User by ID: "+id+" with requestId:"+requestID);
            userService.deleteUser(id, true);
        }


        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Deleting User service took " + timeTook + " ms");

        return new ResponseEntity<>(HttpStatus.OK);
    }

    //Exclude this endpoint from authentication and authorization
    @PostMapping(value = "/portal/token")
    @Operation(
            summary = "This Api is used to get user token by user id",
            parameters = {
                    @Parameter(name = "tokenRequest", description = "The json body of Token request with username and password"),
            }
    )

    public ResponseEntity<UserTokenResponse> findUserToken(@RequestBody @Validated TokenRequest tokenRequest,
                                                           BindingResult bindingResult) {
        var startMillis = System.currentTimeMillis();
        UUID requestID = UUID.randomUUID();

        tokenRequestValidator.validate(tokenRequest, bindingResult);
        ApiHubUtils.checkRequestErrors(bindingResult);

        log.info("Request received for Getting user token by username: "+tokenRequest.getUsername()+" with requestId:"+requestID);

        var result = userService.getUserTokenById(requestID, tokenRequest.getUsername(), tokenRequest.getPassword());

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Get user token by id service took " + timeTook + " ms");

        return new ResponseEntity<>(result, result != null ? HttpStatus.OK: HttpStatus.FORBIDDEN);
    }

    //Exclude this endpoint from authentication and authorization
    @PostMapping(value = "/admin/token")
    @Operation(
            summary = "This Api is used to get user token by user id",
            parameters = {
                    @Parameter(name = "tokenRequest", description = "The json body of Token request with username and password"),
            }
    )

    public ResponseEntity<UserTokenResponse> findAdminToken(@RequestBody @Validated TokenRequest tokenRequest,
                                                           BindingResult bindingResult) {
        var startMillis = System.currentTimeMillis();
        UUID requestID = UUID.randomUUID();

        tokenRequestValidator.validate(tokenRequest, bindingResult);
        ApiHubUtils.checkRequestErrors(bindingResult);

        log.info("Request received for Getting admin token by username: "+tokenRequest.getUsername()+" with requestId:"+requestID);

        var result = userService.getAdminTokenById(requestID, tokenRequest.getUsername(), tokenRequest.getPassword());

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Get admin token by id service took " + timeTook + " ms");

        return new ResponseEntity<>(result, result != null ? HttpStatus.OK: HttpStatus.FORBIDDEN);
    }

    //Exclude this endpoint from authentication and authorization
    @GetMapping(value = "/refreshToken")
    @Operation(
            summary = "This Api is used to get access token by refresh token ",
            parameters = {
                    @Parameter(name = "refresh_token", description = "The refresh token of the user")
            }
    )

    public ResponseEntity<UserTokenResponse> getUserRefreshToken(
            @RequestHeader(name = "refresh_token") String refreshToken

    ) {
        var startMillis = System.currentTimeMillis();
        UUID requestID = UUID.randomUUID();
        log.info("Request received for Getting user token by refreshToken with requestId:"+requestID);

        var result = userService.getUserTokenByRefreshToken(requestID,refreshToken);

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Get user token by refresh token service took " + timeTook + " ms");

        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    //Exclude this endpoint from authentication and authorization
    @GetMapping(value = "/logout")
    @Operation(
            summary = "This Api is used to logout user by refresh token ",
            parameters = {
                    @Parameter(name = "refresh_token", description = "The refresh token of the user")
            }
    )

    public ResponseEntity<UserTokenResponse> logoutUser(
            @RequestHeader(name = "refresh_token") String refreshToken

    ) {
        var startMillis = System.currentTimeMillis();
        UUID requestID = UUID.randomUUID();
        log.info("Request received for Logging out user token by refreshToken with requestId:"+requestID);

        userService.logoutUserByRefreshToken(requestID,refreshToken);

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Logging out user by refresh token service took " + timeTook + " ms");

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping(value = "/username/{userName}")
    @Operation(
            summary = "This Api is used to get user by username",
            parameters = {
                    @Parameter(name = "userName", description = "The username of the user"),
            }
    )
    public ResponseEntity<User> findUserByUserName(
            @PathVariable(name = "userName", required = true) String userName

    ) {
        var startMillis = System.currentTimeMillis();
        UUID requestId = UUID.randomUUID();
        log.info("Request received for Getting user by username: " + userName + " with requestId:" + requestId);

        var result = userService.getUserByUsername(userName);

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Get user by username service took " + timeTook + " ms");

        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @RequiresPermission("sub-account-add")
    @PostMapping(value = "/portal/sub-account/token")
    @Operation(summary = "This Api is used to switch to sub-account by id")
    public ResponseEntity<UserTokenResponse> switchToSubAccount(@RequestBody @Validated SwitchSubAccountRequest request, Authentication authentication) {
        var startMillis = System.currentTimeMillis();
        UUID requestID = UUID.randomUUID();

        log.info("Request received for switch to sub-account by id: {} with requestId: {}", request.getSubAccountId(), requestID);

        var result = userService.switchToSubAccount(requestID, request.getSubAccountId(),
                (com.azm.apihub.backend.users.models.UserDetails) authentication.getPrincipal());

        var endMillis = System.currentTimeMillis();
        var timeTook = endMillis - startMillis;
        log.info("Switch to sub-account by id service took {} ms", timeTook);

        return new ResponseEntity<>(result, result != null ? HttpStatus.OK: HttpStatus.FORBIDDEN);
    }
}
