use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
  #[msg("The candidate isn't active")]
  NotActiveCandidate,
  #[msg("The candidate isn't ended")]
  NotEndedCandidate,
}
