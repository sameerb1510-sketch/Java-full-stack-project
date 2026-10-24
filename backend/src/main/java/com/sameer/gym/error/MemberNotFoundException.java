package com.sameer.gym.error;

public class MemberNotFoundException extends RuntimeException {
    public MemberNotFoundException(Long id) {
        super("Member with id " + id + " was not found");
    }

    public MemberNotFoundException(String identifier) {
        super(identifier);
    }
}
