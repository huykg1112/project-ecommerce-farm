CREATE TABLE agent_request (
    request_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    request_status_id UUID NOT NULL,
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_date TIMESTAMP,
    admin_id UUID,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES "user"(user_id),
    CONSTRAINT fk_admin FOREIGN KEY (admin_id) REFERENCES "user"(user_id),
    CONSTRAINT fk_request_status FOREIGN KEY (request_status_id) REFERENCES order_status(status_id)
); 