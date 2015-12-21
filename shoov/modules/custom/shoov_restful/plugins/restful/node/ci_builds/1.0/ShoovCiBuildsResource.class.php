<?php

/**
 * @file
 * Contains ShoovCiBuildsResource.
 */

class ShoovCiBuildsResource extends \ShoovEntityBaseNode {


  /**
   * Overrides \RestfulEntityBaseNode::publicFieldsInfo().
   */
  public function publicFieldsInfo() {
    $public_fields = parent::publicFieldsInfo();

    $public_fields['enabled'] = array(
      'property' => 'field_ci_build_enabled',
    );

    $public_fields['git_branch'] = array(
      'property' => 'field_git_branch',
    );

    $public_fields['repository'] = array(
      'property' => 'og_repo',
      'resource' => array(
        'repository' => array(
          'name' => 'repositories',
          'full_view' => FALSE,
        ),
      ),
    );

    $public_fields['interval'] = array(
      'property' => 'field_ci_build_interval',
    );

    $public_fields['private_key'] = array(
      'property' => 'field_private_key',
    );

    $public_fields['status_token'] = array(
      'property' => 'field_status_token',
    );

    return $public_fields;
  }

  /**
   * {@inheritdoc}
   *
   * Catch '.shoov.yml is missing' exception and through
   * restful exception instead.
   */
  public function createEntity() {
    try {
      $entity = parent::createEntity();
    }
    catch (Exception $e) {
      if ($e->getMessage() == '.shoov.yml is missing in the root of the repository.') {
        throw new \RestfulBadRequestException(".shoov.yml is missing in the root of the repository.");
      }
      throw $e;
    }
    return $entity;
  }

  /**
   * {@inheritdoc}
   *
   * Catch '.shoov.yml is missing' exception and through
   * restful exception instead.
   */
  public function patchEntity($entity_id) {
    try {
      $entity = parent::patchEntity($entity_id);
    }
    catch (Exception $e) {
      if ($e->getMessage() == '.shoov.yml is missing in the root of the repository.') {
        throw new \RestfulBadRequestException(".shoov.yml is missing in the root of the repository.");
      }
      throw $e;
    }
    return $entity;
  }
}
